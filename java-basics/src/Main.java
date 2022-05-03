import javax.swing.*;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        //FOR-EACH LOOP
        //less steps, more readable
        //less flexible
        String[] colors = {"Red", "Blue", "Green"};
        for (String i : colors) {
            System.out.println(i);
        }

        //METHODS (functions)
        //below is method, outside of main method
        loopMessage("SHIT", 3);
        int num1, num2;
        num1 = 34;
        num2 = 87;
        int result = addNumbers(num1, num2);

        //OVERLOADED METHODS
        //same method name, different parameters
        //there are 3 methods with the name add, but they have a different # of arguments
        int add1, add2, add3;
        add1 = add(1, 2);
        add2 = add(34, 54, 34);
        add3 = add(2, 3, 234, 234);

        //PRINT F
        //special way to print lines to the console
        //can put width (spaces) in string by putting int before special modifier
        boolean myB = true;
        char myC = 'a';
        String myS = "Hello";
        int myN = 234;
        double myD = 234.234;
        System.out.printf("my is %b. my char is %5c. my string is %5s. my int is %5d. my double is %.3f", myB, myC, myS, myN, myD);
        System.out.println();

        //FINAL KEYWORD
        //basically a const
        final int noChangeNum = 234;

        //OOP (OBJECT ORIENTED PROGRAMMING)
        Car myCar = new Car();
        System.out.println("My car is a " + myCar.year + " " + myCar.make + " " + myCar.model + ". It is " + myCar.color + " and costs around $" + myCar.price);
        myCar.drive();
        myCar.brake();
        Car myCar2 = new Car();
        myCar2.drive();
        myCar2.brake();

        //CONSTRUCTOR
        Human person = new Human("Alex", 23, 175.23);
        Human person2 = new Human("Ricky", 2, 14.432);
        System.out.println(person.name);
        System.out.println(person2.name);
        person.drink();
        person2.eat();

        //GLOBAL VS LOCAL (SCOPE)
        DiceRoller dice = new DiceRoller();

        //OVERLOADED CONSTRUCTORS
        Pizza pizza = new Pizza("thicc bread");
        Pizza pizza1 = new Pizza("Cheese bread", "Tomato sauce");
        Pizza pizza2 = new Pizza("Onion bread", "Onion sauce", "Light cheese");
        Pizza pizza3 = new Pizza("Garlic bread", "Garlic saouce", "Garlic cheese", "Garlic topppings");

        //TOSTRING()
        //can represent any object as string
        //must override toString method inside of class
        Car newCar = new Car();
        System.out.println(newCar);

        //ARRAY OF OBJECTS
        Food[] foodToEat = new Food[3];
        Food food1 = new Food("Chicken");
        Food food2 = new Food("Hotdog");
        Food food3 = new Food("Pizza");
        foodToEat[0] = food1;
        foodToEat[1] = food2;
        foodToEat[2] = food3;
        System.out.println(foodToEat[0].name);
        System.out.println(foodToEat[1].name);
        System.out.println(foodToEat[2].name);

        //OBJECT PASSING AS ARGUMENTS
        Garage garage = new Garage();
        Motorcycles bike = new Motorcycles("cyclier");
        garage.park(bike);

        //STATIC
        Friend friend1 = new Friend("wings");
        Friend friend2 = new Friend("richard");
        Friend friend3 = new Friend("wings");
        Friend.listNumOfFriends();

        //INHERITANCE
        Phone iphone = new Phone("iPhone", 999.98);
        Desktop iMac = new Desktop("iMac Pro", 2500.56);
        iMac.deviceDetails();

        //METHOD OVERRIDING
        //creating method in child class with same name in parent class
        //iphone variable has override method inside
        iphone.deviceDetails();

        //SUPER
        //refers to superclass of an object
        //very similar to "this" keyword
        Hero superman = new Hero("wingsofredemption", 34, "sniffing powers");
        superman.saveCity();

        //ABSTRACT
        //abstract class cannot be instantiated, but they can have a subclass
        //Animal x = new Animal() WONT work
        Pig piggie = new Pig(1237.23);

        //ACCESS MODIFIERS
        //PUBLIC || PROTECTED || PRIVATE || DEFAULT
        //look at package1 and package2

        //ENCAPSULATION
        //attributes of a class being hidden or private
        //can only be accessed through methods (get and set)
        Car2 car2 = new Car2("Honda", "Accord", 109234.234);
        String car2Brand = car2.getBrand();
        String car2Model = car2.getModel();
        double car2Price = car2.getPrice();
        System.out.println("The " + car2Brand + " " + car2Model + " costs around $" + car2Price);
        car2.changeBrand("Tesla");
        car2.changeModel("Model 3");
        car2.changePrice(1290381923.234534534);
        System.out.println("Changed the car to " + car2.getBrand() + " " + car2.getModel() + ", which now costs $" + car2.getPrice());

        //COPY OBJECTS
        //DO NOT want to simply set one obj equal to another
        // WRONG obj = obj2 (all this does is set obj address in memory to the same as obj2's)

        //INTERFACE
        //template that can be applied to a class
        //specifies what a class has/must do
        //class can have more than 1 interface, inheritance is limited to 1 parent class
        Rabbit rabbit = new Rabbit();
        rabbit.flee();
        Hawk hawk = new Hawk();
        hawk.hunt();
        Fish fish = new Fish();
        fish.flee();
        fish.hunt();

        //POLYMORPHISM
        //ability of an object to identify as more than one type
        Car3 car4 = new Car3();
        Boat boat = new Boat();
        //we are able to define an array of VEHICLES
        //defining an array of either car4 or boat would not work
        //can use the superclass to enscope all child classes
        Vehicle[] racers = {car4, boat};
        for (Vehicle i : racers) {
            i.go();
        }

        //DYNAMIC POLYMORPHISM
        //polymorphism = many shapes/forms
        //dynamic = during runtime
        Scanner user_input = new Scanner(System.in);
        SeaAnimal seaAnimal;
        System.out.print("What type of animal do you want (D: dolphin, P: pufferfish): ");
        String animalChoice = user_input.next();

        if (animalChoice.equalsIgnoreCase("D")) {
            seaAnimal = new Dolphin();
        } else if (animalChoice.equalsIgnoreCase("P")) {
            seaAnimal = new PufferFish();
        } else {
            System.out.println("choice " + animalChoice + " is invalid");
            seaAnimal = new SeaAnimal();
        }

        seaAnimal.speak();

        //EXCEPTIONS
        //event that occurs during the execution
        //disrupts normal flow of instructions
        try {
            System.out.print("Enter a whole number to divide: ");
            int n = user_input.nextInt();
            System.out.print("Enter another whole number to divide: ");
            int n2 = user_input.nextInt();
            int z = n / n2;
            System.out.println("result = " + z);
        } catch (Throwable err) {
            System.out.println(err);
            System.out.println("There was an error in the program :(");
        } finally {
            System.out.println("closed scanner!");
            user_input.close();
        }

        //FILE CLASS
        File file = new File("message.txt");
        if (file.exists()) {
            System.out.println("File exists!");
            System.out.println("file path - " + file.getPath());
            System.out.println("DELETING FILE");
            file.delete();

        } else {
            System.out.println("File message.txt does not exist :(");
        }

        //FILEWRITER
        try {
            FileWriter writer = new FileWriter("demo.txt");
            writer.write("I just shit my  and it smells so bad\nI wonder if anyone in the room can smell it");
            writer.append("\nend of story");
            writer.close();
        } catch (Throwable err) {
            System.out.println(err);

        }

        //FILEREADER
        try {
            FileReader reader = new FileReader("demo.txt");
            int data = reader.read();

            //data will be -1 when all data has been read from file
            while (data != -1) {

                System.out.print((char) data);
                data = reader.read();
            }
            reader.close();

        } catch (Throwable err) {
            System.out.println(err);
        }


        //GUI
        //JFRAME
        JFrame frame = new JFrame();
        frame.setVisible(true);
        frame.setSize(420,420); //x and y dimension
        frame.setTitle("Java application");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); //exit out of application when X is clicked
        frame.setResizable(false); //prevent frame from being resized
        ImageIcon image = new ImageIcon("logo.png");
        frame.setIconImage(image.getImage());

    }


    static void loopMessage(String message, int iterations) {
        for (var i = 0; i < iterations; ++i) {
            System.out.println(message);
        }
    }

    static int addNumbers(int num1, int num2) {
        int total = num1 + num2;
        System.out.println(num1 + " + " + num2 + " = " + total);
        return num1 + num2;
    }

    static int add(int a, int b) {
        return a + b;
    }

    static int add(int a, int b, int c) {
        return a + b + c;
    }

    static int add(int a, int b, int c, int d) {
        return a + b + c + d;
    }
}