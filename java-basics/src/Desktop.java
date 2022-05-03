public class Desktop extends Device{
    int numOfUsbs; //unique to desktop, phone does not posses this variable

    Desktop(String name, double price) {
        this.deviceName = name;
        this.price = price;
    }
}
