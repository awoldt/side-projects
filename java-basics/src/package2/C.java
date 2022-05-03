package package2;
import package1.*;

public class C {
    //DEFAULT
    //no access modifier
    //can only be accessed by classes inside of same package
    String defaultMessage = "This is the default";

    //PUBLIC
    //visable to any package within project folder
    public String publicMessage = "This is a public message";

    //PROTECTED
    //only accessible to classes that extend this class
    protected String protectedMessage = "This message is protected";

    //PRIVATE
    //only accessible to current class
    private String privateMessage = "This is a private message";

}
