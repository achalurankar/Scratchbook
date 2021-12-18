public with sharing class scratchbook_cc {
    public scratchbook_cc() {

    }

    @AuraEnabled
    public static string savePage(string requestStructure){
        try {
            PageWrapper wrapper = (PageWrapper) JSON.deserialize(requestStructure, PageWrapper.class);
            Page__c page = new Page__c();
            if(wrapper.pageId != null) {
                page.Id = wrapper.pageId;
            }
            page.Data__c = wrapper.imageData;
            page.Book__c = wrapper.bookId;
            upsert page;
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static List<Page__c> getPages(string bookId){
        try {
            return [SELECT Id, Data__c FROM Page__c WHERE Book__c = :bookId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class PageWrapper {
        string bookId;
        string pageId;
        string imageData;
    }
}