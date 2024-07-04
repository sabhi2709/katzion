import { LightningElement, track, wire } from 'lwc';
import getLeads from '@salesforce/apex/LeadController.getLeads';
import getLeadCount from '@salesforce/apex/LeadController.getLeadCount';
import syncContacts from '@salesforce/apex/ContactSyncService.syncContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LeadSearchFilter extends LightningElement {
        @track leads;
        @track error;
        @track searchKey = '';
        @track leadSource = '';
        @track pageSize = 10;
        @track pageNumber = 1;
        @track totalRecords;
        @track totalPages;
        recordsToDisplay;
        records;
    
        columns = [
            { label: 'First Name', fieldName: 'FirstName' },
            { label: 'Last Name', fieldName: 'LastName' },
            { label: 'Company', fieldName: 'Company' },
            { label: 'Lead Source', fieldName: 'LeadSource' },
            { label: 'Status', fieldName: 'Status' },
        ];
    
        pageSizeOptions = [
            { label: '5', value: 5 },
            { label: '10', value: 10 },
            { label: '25', value: 25 },
            { label: '50', value: 50 },
        ];
    
        connectedCallback() {
            this.fetchLeads();
        }
    
        @wire(getLeadCount, { searchKey: '$searchKey', leadSource: '$leadSource' })
        wiredLeadCount({ error, data }) {
            if (data) {
                
                this.totalRecords = data;
                console.log('wiretotalRecords'+this.totalRecords);
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                console.log('wiretotalPages'+this.totalPages);
            } else if (error) {
                this.error = error;
            }
        }
    
        @wire(getLeads, { searchKey: '$searchKey', leadSource: '$leadSource', pageSize: '$pageSize', pageNumber: '$pageNumber' })
        wiredLeads({ error, data }) {
            if (data) {
                this.leads = data;
                this.records = data;
                console.log('leads'+JSON.stringify(this.leads))
            } else if (error) {
                this.error = error;
            }
        }
    
        handleSearchKeyChange(event) {
            this.searchKey = event.target.value;
            this.pageNumber = 1; 
            this.fetchLeads();
        }
    
        handleLeadSourceChange(event) {
            this.leadSource = event.target.value;
            this.pageNumber = 1;
            this.fetchLeads();
        }
    
        handlePageSizeChange(event) {
            this.pageSize = event.target.value;
            this.pageNumber = 1; 
            this.fetchLeads();
        }
    
        handlePreviousPage() {
            if (this.pageNumber > 1) {
                this.pageNumber -= 1;
                this.fetchLeads();
            }
        }
    
        handleNextPage() {
            if (this.pageNumber < this.totalPages) {
                this.pageNumber += 1;
                this.fetchLeads();
            }
        }
    
        fetchLeads() {
            getLeadCount({ searchKey: this.searchKey, leadSource: this.leadSource })
                .then(result => {
                    this.totalRecords = result;
                     console.log('totalRecords'+this.totalRecords);
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                    console.log('totalPages'+this.totalPages);
                    this.paginationHelper();
                })
                .catch(error => {
                    this.error = error;
                });
    
            getLeads({ searchKey: this.searchKey, leadSource: this.leadSource, pageSize: this.pageSize, pageNumber: this.pageNumber })
                .then(result => {
                    console.log('getrecords'+JSON.stringify(result));
                    this.records = result;
                    //this.leads = result;
                })
                .catch(error => {
                    this.error = error;
                });
        }
    
        handleSyncContacts() {
            syncContacts()
                .then((result) => {
                    if(result == 'Success'){
                            this.showToastMessage('Success','Contacts synchronized successfully!','success');
                    }
                    else {
                        this.showToastMessage('Error','Failed to synchronize ','error');
                    }
                   
                })
                .catch(error => {
                    this.error = error;
                    this.showToastMessage('Error','Failed to synchronize contacts: ','error');
                });
        }
    get isFirstPage() {
        return this.pageNumber === 1;
    }

    get isLastPage() {
        return this.pageNumber >= Math.ceil(this.totalLeads / this.pageSize);
    }

     paginationHelper() {
        this.recordsToDisplay = [];
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } 
        else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }

    showToastMessage(toastTitle,toastMessage,toastVariant){
        const evt = new ShowToastEvent({
            title : toastTitle,
            message : toastMessage,
            variant :toastVariant,
        });
        this.dispatchEvent(evt);
    }
}