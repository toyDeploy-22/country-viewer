import mongoose from 'mongoose';

const continentSchema = new mongoose.Schema({
  continentId: {
	  type: String, 
	  maxLength: 2, 
  enum: {
	  values: ["NA", "SA", "EU", "AF", "AS", "OC", "AN"],
	  message: "The continent is not recognized. Make sure the continent is a listed abbreviation."
  }, 
  required: [true, "The continent ID is mandatory."]
	}
});

const countrySchema = new mongoose.Schema({
	
 countryId: {
	 type: String, uppercase: true, minLength: [2, "The country ID must contain at least two characters."], maxLength: [7, "The country ID cannot contain more than 7 characters."], required: [true, "country ID is required."]
 },
 
 countryName: {
	 type: String, minLength: [2, "A country name must contain at least more than one letter."], maxLength: [40, "The country Name can contain 40 characters maximum."], required: [true, "The country Name is required."]
	 },
	 
 countryFlag_url: {type: String, required: false,  minLength: [3, "The country flag url is not mandatory. Make sure to fill-in this field only if you have a valid link address."], maxLength: [250, "for security reasons, the country Flag cannot contain more than 250 characters."]}, 
 
 countryDescription: {
	 type: String, minLength: [10, "If filled-in, the country Description must at least contain a sentence of 10 characters. You can leave this field empty if you want."], maxLength: [160, "The country Description cannot contain more than 250 characters."], required: false
	 },
 
 continent: continentSchema
},
{ timestamps: true });

const countryModel = mongoose.model('Countrie', countrySchema);

export default countryModel; 