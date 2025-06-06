import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import { useDisclosure, Button, ChakraProvider} from '@chakra-ui/react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
} from '@chakra-ui/react';
import './calcalender.css';
import {Modal} from '@chakra-ui/react' ;
import { Bar } from 'react-chartjs-2';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

function CalorieCalendar({ calories, onDateClick, requiredcalories, selectedDayEntries }) {
  const [value, setValue] = useState(new Date());

  const { isOpen, onOpen, onClose } = useDisclosure()

  const groupedCalories = calories.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    const cal = parseInt(entry.calories);

    if (!acc[date]) acc[date] = cal;
    else acc[date] += cal;

    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    const key = date.toDateString();
    const calorie = groupedCalories[key];

    if (view === 'month') {
      let bgColor = '';
      if (calorie === requiredcalories) bgColor = '#4caf50';
      else if (calorie > requiredcalories) bgColor = '#ff9800';
      else if (calorie > 0) bgColor = '#f44336';

      return calorie ? (
        <div
          style={{
            marginTop: 4,
            fontSize: '0.50rem',
            backgroundColor: bgColor,
            color: 'white',
            borderRadius: '4px',
            padding: '1px 3px',
            textAlign: 'center',
            maxWidth: '100%',
          }}
        >
          {calorie}
        </div>
      ) : null;
    }
    return null;
  };

  const handleDateChange = (date) => {
    setValue(date);
    if (onDateClick) onDateClick(date);
    onOpen()
  };

  const optionsDate = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

  return (
    <div className='calContainer'>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
        w="100%"
      />
      <ChakraProvider>
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box overflowX="auto">
                  <Table variant="striped" colorScheme="teal" size="md">
                    <Thead>
                      <Tr>
                        <Th>Food Item</Th>
                        <Th>Amount(g)</Th>
                        <Th isNumeric>Calories</Th>
                        <Th isNumeric>Proteins(g)</Th>
                        <Th isNumeric>Carbs(g)</Th>
                        <Th isNumeric>Fats(g)</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {selectedDayEntries.map((item, idx) => (
                        <Tr key={idx}>
                          <Td>{item.foodItem}</Td>
                          <Td>{item.foodAmount}</Td>
                          <Td isNumeric>{item.calories}</Td>
                          <Td isNumeric>{item.proteins}</Td>
                          <Td isNumeric>{item.carbs}</Td>
                          <Td isNumeric>{item.fats}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    </div>
  );
}

export default CalorieCalendar;
