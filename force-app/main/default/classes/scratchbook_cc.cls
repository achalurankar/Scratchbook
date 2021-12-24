public with sharing class scratchbook_cc {
    public scratchbook_cc() {

    }

    @AuraEnabled
    public static string savePage(string requestStructure){
        try {
            PageWrapper wrapper = (PageWrapper) JSON.deserialize(requestStructure, PageWrapper.class);
            // upsert page;
            saveUsingContentVersion(wrapper);
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static List<PageWrapper> getPages(string bookId){
        try {
            // return [SELECT Id, Data__c FROM Page__c WHERE Book__c = :bookId];
            //for content version
            List<ContentDocumentLink> cdls = [select ContentDocumentId from ContentDocumentLink where LinkedEntityId = :bookId]; 
            Set<Id> ContentDocumentIds = new Set<Id>();
            for(ContentDocumentLink cdl : cdls) {
                ContentDocumentIds.add(cdl.ContentDocumentId);
            }
            List<ContentVersion> cvs = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId in :ContentDocumentIds];
            // System.System.debug(cvs.size());
            List<PageWrapper> pages = new List<PageWrapper>();
            for(ContentVersion cv : cvs) {
                PageWrapper pw = new PageWrapper();
                pw.bookId = bookId;
                pw.imageData = 'data:image/png;base64,' + EncodingUtil.base64Encode(cv.VersionData);
                pw.pageId = cv.Id;
                pages.add(pw);
            }
            return pages;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    public static void saveUsingContentVersion(PageWrapper page){
        
        ContentVersion cVersion = new ContentVersion();
        cVersion.VersionData = EncodingUtil.base64Decode(page.imageData);
        if(page.pageId != '') {
            //update existing page
            cVersion.Id = page.pageId;
            Update cVersion;
            return;
        }
        //else insert new page
        cVersion.ContentLocation = 'S';
        cVersion.PathOnClient = 'image-' + System.now() + '.png';
        cVersion.Origin = 'H';
        cVersion.Title = 'image-' + System.now() + '.png';
        cVersion.isMajorVersion = false; //to make the versionData editable
        Insert cVersion;
        Id conDocument = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cVersion.Id].ContentDocumentId;
        ContentDocumentLink cDocLink = new ContentDocumentLink();
        cDocLink.ContentDocumentId = conDocument;
        cDocLink.LinkedEntityId = page.bookId;
        cDocLink.ShareType = 'I';
        cDocLink.Visibility = 'AllUsers';
        Insert cDocLink;
    }
    
    public class PageWrapper {
        @AuraEnabled public string bookId;
        @AuraEnabled public string pageId;
        @AuraEnabled public string imageData;
    }
}