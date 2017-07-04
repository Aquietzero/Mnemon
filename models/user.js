var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mnemonDb = require('../model').mnemonDb;

var UserSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    real_name: {
        type: String,
        unique: true
    },
    passwd: {
        type: String,
        require: true
    },
    avatar: String,
    email: String,
    type: {
        type: String,
        enum: ['admin', 'visitor'],
        default: 'visitor'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    // Last time that the user updates his information.
    updated_at: {
        type: Date,
        default: Date.now
    },
    // Last time that the user acts.
    last_active_at: {
        type: Date,
        default: Date.now
    }
}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});


UserSchema.statics.types = function () {
    return UserSchema.path('type').enumValues;
}

module.exports = mnemonDb.model('User', UserSchema);
