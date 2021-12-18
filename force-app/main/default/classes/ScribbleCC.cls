public class ScribbleCC {

    @AuraEnabled
    public static Id savePicture(String imageData, Id recordId){
        
        ContentVersion cVersion = new ContentVersion();
        cVersion.ContentLocation = 'S';
        cVersion.PathOnClient = 'image-' + System.now() + '.png';
        cVersion.Origin = 'H';
        cVersion.Title = 'image-' + System.now() + '.png';
        cVersion.VersionData = EncodingUtil.base64Decode(imageData);
        Insert cVersion;

        Id conDocument = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cVersion.Id].ContentDocumentId;

        ContentDocumentLink cDocLink = new ContentDocumentLink();
        cDocLink.ContentDocumentId = conDocument;
        cDocLink.LinkedEntityId = recordId;
        cDocLink.ShareType = 'I';
        cDocLink.Visibility = 'AllUsers';
        Insert cDocLink;

        return cVersion.Id;
    }
}