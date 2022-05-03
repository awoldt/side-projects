public class Phone extends Device{

    Phone(String name, double price) {
        this.deviceName = name;
        this.price = price;
    }

    @Override
    void deviceDetails() {
        System.out.println("This an iPhone bitch!");
    }

}
