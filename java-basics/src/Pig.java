public class Pig extends Animal{
    double weight;

    Pig(double w) {
        this.weight = w;
    }

    @Override
    void makeNoise() {
        System.out.println("OINK");
    }


}
