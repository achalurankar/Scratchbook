trigger bookTrigger on Book__c (before insert, before update) {
    for(Book__c book : Trigger.new) {
        book.Date_Updated__c = System.now();
    }
}