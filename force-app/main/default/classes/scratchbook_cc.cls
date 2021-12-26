public with sharing class scratchbook_cc {
    public scratchbook_cc() {

    }

    @AuraEnabled
    public static Id savePage(string requestStructure){
        try {
            PageWrapper wrapper = (PageWrapper) JSON.deserialize(requestStructure, PageWrapper.class);
            // upsert page;
            Id updateId = saveUsingContentVersion(wrapper);
            return updateId;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static Id saveUsingContentVersion(PageWrapper page){
        
        ContentVersion cVersion = new ContentVersion();
        cVersion.VersionData = EncodingUtil.base64Decode(page.imageData);
        if(page.pageId != '') {
            //update existing page
            cVersion.Id = page.pageId;
            Update cVersion;
            return cVersion.Id;
        }
        //else insert new page
        cVersion.ContentLocation = 'S';
        cVersion.PathOnClient = 'image-' + System.now() + '.png';
        cVersion.Origin = 'H';
        cVersion.Title = 'image-' + System.now() + '.png';
        cVersion.isMajorVersion = false; //to make the versionData editable
        cVersion.Book__c = page.bookId;
        Insert cVersion;
        return cVersion.Id;
    }

    @AuraEnabled(cacheable = true)
    public static List<PageWrapper> getPages(string bookId){
        try {
            //for content version
            List<ContentVersion> cvs = [SELECT Id, VersionData FROM ContentVersion WHERE Book__c = :bookId];
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

    @AuraEnabled
    public static string deletePage(string pageId){
        try {
            Id cdid = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :pageId].ContentDocumentId;
            ContentDocument cd = new ContentDocument(Id = cdid);
            delete cd;
            return 'Deleted';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    public class PageWrapper {
        @AuraEnabled public string bookId;
        @AuraEnabled public string pageId;
        @AuraEnabled public string imageData;
    }
}