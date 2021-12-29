trigger pageTrigger on ContentVersion (before insert, before update, before delete) {
    Set<Id> bookIds = new Set<Id>();
    for(ContentVersion page : Trigger.new) {
        bookIds.add(page.Book__c);
    }
    List<Book__c> books = [SELECT Date_Updated__c FROM Book__c WHERE Id in :bookIds];
    for(Book__c book : books) {
        book.Date_Updated__c = System.now();
    }
    update books;
}