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
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else if (error) {
                this.error = error;
            }
        }
    
        @wire(getLeads, { searchKey: '$searchKey', leadSource: '$leadSource', pageSize: '$pageSize', pageNumber: '$pageNumber' })
        wiredLeads({ error, data }) {
            if (data) {
                this.leads = data;
            } else if (error) {
                this.error = error;
            }
        }
    
        handleSearchKeyChange(event) {
            this.searchKey = event.target.value;
            this.pageNumber = 1; // Reset to first page
            this.fetchLeads();
        }
    
        handleLeadSourceChange(event) {
            this.leadSource = event.target.value;
            this.pageNumber = 1; // Reset to first page
            this.fetchLeads();
        }
    
        handlePageSizeChange(event) {
            this.pageSize = event.target.value;
            this.pageNumber = 1; // Reset to first page
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
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                })
                .catch(error => {
                    this.error = error;
                });
    
            getLeads({ searchKey: this.searchKey, leadSource: this.leadSource, pageSize: this.pageSize, pageNumber: this.pageNumber })
                .then(result => {
                    this.leads = result;
                })
                .catch(error => {
                    this.error = error;
                });
        }
    
        handleSyncContacts() {
            syncContacts()
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contacts synchronized successfully!',
                            variant: 'success'
                        })
                    );
                })
                .catch(error => {
                    this.error = error;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Failed to synchronize contacts: ' + error.body.message,
                            variant: 'error'
                        })
                    );
                });
        }
    }