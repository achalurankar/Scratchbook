public class AccountList {

    //get list of accounts
    @AuraEnabled
    public static Account[] GetAccounts(String city){
        if(city == '')
        	return [SELECT AccountNumber, Name, Description, Phone, BillingLatitude, BillingLongitude, BillingState, BillingCity, BillingStreet FROM Account];
        else
            return [SELECT AccountNumber, Name, Description, Phone, BillingLatitude, BillingLongitude, BillingState, BillingCity, BillingStreet FROM Account WHERE BillingCity = :city];
    }
    
    //get list of cities for filter dropdown
    @AuraEnabled
    public static String[] GetCityList(){
        return new String[] {'Austin', 'Chicago', 'New York'};
    }
}