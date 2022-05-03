public class Hero extends Person{
    String power;

    //the properties name and age are defined in parent class
    //good practice to set these properties in the class they were defined
    //power is the only property that should be set inside this class, bc its the only one that is defined
    Hero(String name, int age, String power) {
        super(name, age);
        this.power = power;
    }

    void saveCity() {
        System.out.println(name + " has come to rescue the city with his " + power + " abilities. This superhero is " + age + " years old");
    }
}
