public class RefTest {

    public class Test{
        public integer i;
    }
    
    public static void main(){
        Test t = new Test();
        t.i = 1;
        updateVal(t);
        System.debug('value = ' + t.i);
    }
    
    public static void updateVal(Test t){
        t.i = t.i + 1;
    }
}