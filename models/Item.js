import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Lost', 'Found'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    images: {
        type: [String],
        required: true
    },
    location_point: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Lost', 'Found', 'Claimed', 'Returned'],
        default: function() {
            return this.type;
        }
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    contactNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

itemSchema.index({ location_point: '2dsphere' });

const Item = mongoose.model('Item', itemSchema);
export default Item;
