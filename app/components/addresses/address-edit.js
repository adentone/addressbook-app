import Ember from 'ember';

const {set,get,computed} = Ember;
const {notEmpty,not,and} = computed;

export default Ember.Component.extend({
	address: computed({
		get(){
			return {
				addressee:'',
				line1:'',
				line2:'',
				city:'',
				state:'',
				zip: '',
				country:''
			};
		}
	}),
	addresseeValid: notEmpty('address.addressee'),
	line1Valid: notEmpty('address.line1'),
	isAbleToSubmit: and('addresseeValid','line1Valid'),
	isDisabledSubmit: not('isAbleToSubmit'),
	submitLabel: computed('create',{
		get(){
			if (get(this,'create')){
				return 'Create';
			} else {
				return 'Save changes';
			}
		}
	}),
	labelForComponent: computed('create',{
		get(){
			if (get(this,'create')){
				return 'New Address';
			} else {
				return 'Edit Address';
			}
		}
	}),
	data: computed('address.addresse',
		'address.sortname',
		'address.line1',
		'address.line2',
		'address.city',
		'address.state',
		'address.zip',
		'address.country', {
		get(){
			return get(this,'address');
		}	
	}),
	actions: {
		updateValue(fieldName,value){
			set(this,`address.${fieldName}`,value);
		}
	}
});
