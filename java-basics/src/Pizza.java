public class Pizza {
    String crust;
    String sauce;
    String cheese;
    String topping;

    //just bread
    Pizza(String bread) {
        this.crust = bread;
    }

    //just bread and sauce
    Pizza(String bread, String sauce) {
        this.crust = bread;
        this.sauce = sauce;

    }

    //just bread, sauce, and cheese
    Pizza(String bread, String sauce, String cheese) {
        this.crust = bread;
        this.sauce = sauce;
        this.cheese = cheese;

    }

    //all toppings on the pizza
    Pizza(String bread, String sauce, String cheese, String topping) {
        this.crust = bread;
        this.sauce = sauce;
        this.cheese = cheese;
        this.topping = topping;
    }
}
