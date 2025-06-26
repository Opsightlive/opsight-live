
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarBookingProps {
  onBookingComplete: (date: Date, time: string) => void;
}

const CalendarBooking: React.FC<CalendarBookingProps> = ({ onBookingComplete }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooked, setIsBooked] = useState(false);

  // Available time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      onBookingComplete(selectedDate, selectedTime);
      setIsBooked(true);
    }
  };

  if (isBooked) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Demo Scheduled!</h3>
          <p className="text-gray-600 mb-4">
            Your demo is scheduled for {selectedDate?.toLocaleDateString()} at {selectedTime}
          </p>
          <p className="text-sm text-gray-500">
            We'll send you a calendar invite and join link shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Calendar */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => 
              date < new Date() || 
              date.getDay() === 0 || 
              date.getDay() === 6
            }
            className={cn("w-full pointer-events-auto")}
          />
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Select Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className="w-full"
                >
                  {time}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Please select a date first
            </p>
          )}
        </CardContent>
      </Card>

      {/* Booking Button */}
      {selectedDate && selectedTime && (
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Selected:</h4>
                  <p className="text-gray-600">
                    {selectedDate.toLocaleDateString()} at {selectedTime}
                  </p>
                </div>
                <Button onClick={handleBooking} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Book Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalendarBooking;
