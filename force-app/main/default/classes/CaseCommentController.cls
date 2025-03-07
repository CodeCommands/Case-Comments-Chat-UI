public with sharing class CaseCommentController {
    @AuraEnabled(cacheable=true)
    public static List<CommentWrapper> getComments(Id caseId) {
        List<CommentWrapper> commentList = new List<CommentWrapper>();
        List<CaseComment> comments = [SELECT Id, CommentBody, CreatedDate, CreatedById, CreatedBy.Name, CreatedBy.Profile.Name, IsPublished 
                                      FROM CaseComment 
                                      WHERE ParentId = :caseId 
                                      ORDER BY CreatedDate ASC];

        for (CaseComment comment : comments) {
            // Determine if the user is internal or external by checking the profile
            Boolean isInternalUser = comment.CreatedBy.Profile.Name != 'Customer Portal User' && comment.CreatedBy.Profile.Name != 'Partner Community User' && comment.CreatedBy.Profile.Name != 'Customer Community Plus Login User';

            commentList.add(new CommentWrapper(comment, isInternalUser));
        }
        return commentList;
    }

    public class CommentWrapper {
        @AuraEnabled public CaseComment comment { get; set; }
        @AuraEnabled public Boolean isInternalUser { get; set; }
        public CommentWrapper(CaseComment comment, Boolean isInternalUser) {
            this.comment = comment;
            this.isInternalUser = isInternalUser;
        }
    }
}