public class Human {
    String name;
    int age;
    double weight;

    //this is the constructor
    //it has to have the same name as the class
    Human(String name, int age, double weight) {
        this.name = name;
        this.age = age;
        this.weight = weight;
    }

    void eat() {
        System.out.println(this.name + " is eating chicken!");
    }
    void drink() {
        System.out.println(this.name + " is drinking vodka");
    }
}
