import Item from '../models/Item.js';
import User from '../models/User.js';

export const getItems = async (req, res) => {
    try {
        const { search, category, type, isApproved, lat, lng, radius = 5000 } = req.query; 

        
        if (isApproved !== undefined) {
            query.isApproved = isApproved === 'true';
        } else {
            query.isApproved = true;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== 'All Items') {
            query.category = category;
        }

        if (type) {
            query.type = type;
        }

        
        if (lat && lng) {
            query.location_point = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            };
        }

        const items = await Item.find(query)
            .sort(lat && lng ? {} : { createdAt: -1 }) 
            .populate('poster', 'username');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyItems = async (req, res) => {
    try {
        const items = await Item.find({ poster: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('poster', 'username email createdAt');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createItem = async (req, res) => {
    try {
        const { title, description, type, category, location, images, lat, lng, contactNumber } = req.body;
        const item = new Item({
            title,
            description,
            type,
            category,
            location,
            images,
            contactNumber,
            location_point: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            poster: req.user.id,
            isApproved: false 
        });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateItemStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        
        // Ensure user is the owner
        if (item.poster.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this item' });
        }
        
        item.status = status;
        await item.save();
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalLost = await Item.countDocuments({ type: 'Lost' });
        const resolvedItems = await Item.countDocuments({ status: { $in: ['Found', 'Returned', 'Claimed'] } });
        const pendingRequests = await Item.countDocuments({ isApproved: false });

        res.json({
            totalUsers,
            totalLost,
            resolvedItems,
            pendingRequests
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
