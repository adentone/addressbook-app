import Ember from 'ember';

const {
	get,
	set,
	getProperties,
	run,
	isNone,
	isEqual,
	computed,
} = Ember;

const {or,and,lte,not} = computed;

/* global Papa */

export default Ember.Component.extend({
	desktopWidth: computed({
		get(){
			return window.innerWidth;
		}
	}),
	mobile: lte('desktopWidth',600),
	isToggled: or('isEditingAddress','isCreatingAddress'),
	mobileToggled: and('mobile','isToggled'),
	isNotToggled: not('isToggled'),
	notDeleting: not('isDeleting'),
	isDeletingNotToggled: and('isDeleting','isNotToggled'),
	notToggledNotDeleting: and('notDeleting','isNotToggled'),

	store: Ember.inject.service(),
	classNames: ['address-main'],
	isCreatingAddress: false,
	query: '',
	_resetAddresses(newArray){
		set(this,'_addresses',newArray);
	},
	filterAddresses(query){
		let addresses = get(this,'addresses');
		let filtered = addresses.filter((item)=>{
			let filterOut = false;
			item.eachAttribute(attrName=>{
				if (!isEqual(attrName,'rev')){
					let fieldVal = get(item,attrName);
					if (isEqual(typeof fieldVal,"string")){
						if (!isEqual(fieldVal.toLowerCase().indexOf(query), -1)){
							filterOut = true;
						}
					}
				}
			});
			return filterOut;
		});
		set(this,'_query',query);
		run.scheduleOnce('actions',this, '_resetAddresses',filtered);
	},
	addressesFiltered: computed('query','_addresses','addresses',{
		get(){
			let {query,_query} = getProperties(this,
				['query','_query']);
			if (!isEqual(query,_query)){
				run.debounce(this,'filterAddresses',query,500);	
			}
			return get(this,'addressesComputed');
		}	
	}),
	addressesComputed: computed('addresses','_addresses',{
		get(){
			let {addresses,_addresses} = getProperties(this,
				['addresses','_addresses']);
			if (isNone(_addresses)){
				set(this,'_addresses',addresses);
				return addresses;
			} else {
				return _addresses;
			}
		}
	}),
	selectedAddressOneWay: computed('selectedAddress',{
		get(){
			let selectedAddress = get(this,'selectedAddress');
			let selectedAddressOneWay = {};
			selectedAddress.eachAttribute(attributeName=>{
				selectedAddressOneWay[attributeName] = get(selectedAddress,attributeName);
			});
			return selectedAddressOneWay;
		}
	}),
	actions: {
		toggleCreateNewAddress(){
			let isEditingAddress = get(this,'isEditingAddress');
			if (!isEditingAddress) {
				this.toggleProperty('isCreatingAddress');
			}
		},
		createNewAddress(data){
			let store = get(this,'store');
			let record = store.createRecord('address',data);
			record.save().then(()=>{
				set(this,'_addresses',store.peekAll('address'));
				this.toggleProperty('isCreatingAddress');
			});
		},
		toggleAddressEdit(address){
			let {
				isEditingAddress,
				isCreatingAddress
			} = getProperties(this,
				[
				'isEditingAddress',
				'isCreatingAddress',
			]);
			if (!isEditingAddress && !isCreatingAddress){
				set(this,'selectedAddress',address);
				this.toggleProperty('isEditingAddress');
			} else if (isEditingAddress){
				this.toggleProperty('isEditingAddress');
			}
		},
		confirmDelete(){
			let address = get(this,'addressUnderDeletion');
			address.destroyRecord();
			let store = get(this,'store');
			set(this,'_addresses',store.peekAll('address'));
			set(this,'isDeleting',false);
		},
		cancelDelete(){
			set(this,'addressUnderDeletion',null);
			set(this,'isDeleting',false);
		},
		deleteAddress(address){
			set(this,'addressUnderDeletion',address);
			set(this,'isDeleting',true);
		},
		submitEditedAddress(data){
			let selectedAddress = get(this,'selectedAddress');
			selectedAddress.eachAttribute(attrName=>{
				set(selectedAddress,attrName,data[attrName]);
			});
			selectedAddress.save().then(()=>{
				this.toggleProperty('isEditingAddress');
			});
		},
		updateQuery(value){
			set(this,'query',value);
		},
		toCSV(){
			let addresses = get(this,'addressesFiltered');
			let json = addresses.map(address=>{
				return address.toJSON();
			});
			let csv = Papa.unparse(json);
			window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
		}

	}
});
