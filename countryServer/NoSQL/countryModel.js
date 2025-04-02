import mongoose from 'mongoose';

const continentsAbbr = ;

const continentSchema = new mongoose.Schema({
  continentId: {type: String, 
  maxLength: 2, 
  enum: {
	  values: ["NA", "SA", "EU", "AF", "AS", "OC"],
	  message: "The continent is not recognized. Make sure the continent is a listed abbreviation."
  }, 
  required: [true, "The continent ID is mandatory."
  }
});

const countrySchema = new mongoose.Schema({
	
 countryId: {
	 type: String, uppercase: true, minLength: [2, "The country ID must contain at least two characters."], maxLength: [6, "The country ID cannot contain more than 6 characters."], required: [true, "country ID is required."]
 },
 
 countryName: {
	 type: String, minLength: [2, "A country name must contain at least more than one letter."], maxLength: [40, "The country Name can contain 40 characters maximum."], required: [true, "The country Name is required."]
	 },
	 
 countryFlag_url: {type: String, required: false}, 
 
 countryDescription: {
	 type: String, minLength: [10, "If filled-in, the country Description must at least contain a sentence of 10 characters. You can leave this field empty if you want."], maxLength: [250, "The country Description cannot contain more than 250 characters."], required: false
	 },
 
 continent: {
 continentId: [continentSchema]
	},

{ timestamps: true }
});

const countryModel = mongoose.model('Countrie', countrySchema);

export default countryModel; 