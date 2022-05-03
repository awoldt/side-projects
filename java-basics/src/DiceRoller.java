import java.util.Random;

public class DiceRoller {

    Random randNum; //global variable


    DiceRoller() {
        randNum = new Random();
        roll();
    }

    void roll() {
        int n = randNum.nextInt(6) + 1;
        System.out.println("You rolled a " + n);
    }
}
