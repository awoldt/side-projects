public class Car2 {
    private String brand;
    private String model;
    private double price;

    Car2(String b, String m, double p) {
        this.brand = b;
        this.model = m;
        this.price = p;
    }

    //must make public get/set methods to access variables above
    //GETTER
    public String getBrand() {
        return brand;
    }
    public String getModel() {
        return model;
    }
    public double getPrice() {
        return price;
    }
    //SETTER
    public void changeBrand(String b) {
        this.brand = b;
    }
    public void changeModel(String m) {
        this.model = m;
    }
    public void changePrice(double p) {
        this.price = p;
    }
}
