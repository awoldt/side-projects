public class Car {

    String make = "Honda";
    String model = "Accord";
    int year = 2004;
    String color = "red";
    double price = 123432.34;


    void drive() {
        System.out.println("You are driving the car!");
    }

    void brake() {
        System.out.println("You stepped on the brakes!");
    }

    public String toString() {
        String myString = make + "\n" + model + "\n" + year + "\n" + color + "\n" + price;
        return myString;
    }

}
