import { LightningElement, api, wire } from 'lwc';
import getCaseComments from '@salesforce/apex/CaseCommentController.getComments';

export default class CaseComments extends LightningElement {
    @api recordId; 
    @api defaultUserName; // The default username to show for internal users
    caseComments = [];

    @wire(getCaseComments, { caseId: '$recordId' })
    wiredComments({ error, data }) {
        if (data) {
            this.caseComments = data.map(wrapper => {
                const { comment, isInternalUser } = wrapper;

                // Format the CreatedDate to MM/DD/YYYY, h:mm A (e.g., 7/23/2024, 11:49 AM)
                const formattedDate = new Date(comment.CreatedDate).toLocaleString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });

                // Use the default user name for internal users, otherwise use the actual name
                let createdByName = isInternalUser && this.defaultUserName
                    ? this.defaultUserName
                    : comment.CreatedBy.Name;

                return {
                    ...comment,
                    createdByName,
                    formattedDate,
                    commentClass: isInternalUser ? 'internal-comment' : 'external-comment'
                };
            });
        } else if (error) {
            console.error('Error fetching case comments:', error);
        }
    }
}