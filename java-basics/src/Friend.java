public class Friend {
    String name;
    static int numberOfFriends; //the value of this is shared across all instances of the Friend class


    Friend(String name) {
        this.name = name;
        numberOfFriends+=1;
    }

    static void listNumOfFriends() {
        System.out.println("There are " + numberOfFriends + " total friends");
    }
}
