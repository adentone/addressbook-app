import { Model } from 'ember-pouch';
import attr from 'ember-data/attr';
import Ember from 'ember';

const {computed:{notEmpty}} = Ember;

export default Model.extend({
	addressee: attr('string'),
  sortname: attr('string', {defaultValue:''}),
	type: attr('string', {defaultValue:''}),
	line1: attr('string'),
	line2: attr('string', {defaultValue:''}),
	city: attr('string', {defaultValue:''}),
	state: attr('string', {defaultValue:''}), // state, province, or region
	zip: attr('string', {defaultValue:''}),  // Zip code, postcode, or postal code
	country: attr('string', {defaultValue:''}), 
	isActive: attr('boolean', { 
		defaultValue: true 
	}),
	dateCreated: attr('date', {
		defaultValue() { return new Date(); }
	}),
	dateEdited: attr('date', {
		defaultValue() { return new Date(); }
	}),
	dateDeactivated: attr('date'),
	isCity: notEmpty('city'),
	isZip: notEmpty('zip')
});


