'use strict'

const Event = require('./event.model');

exports.testEvent = (req, res) => {
    res.send({ message: 'Test function' });
}

exports.addEvent = async (req, res) => {
    try {
        let data = req.body;
        let existEvent = await Event.findOne({ date: data.date });
        if (existEvent) return res.status(404).send({ message: 'An event is already in this section with that date, change the date' })
        let event = new Event(data);
        await event.save();
        return res.send({ message: 'Event created successfully', event });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating event' })
    }
}

exports.getEvent = async (req, res) => {
    try {
        let event = await Event.find();
        return res.send({ message: 'Event found', event });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting Event' });
    }
}

exports.getevent = async (req, res) => {
    try {
        let eventId = req.params.id;
        let event = await Event.findOne({ _id: eventId }).populate('typeevent');
        if (!event) return res.status(404).send({ message: 'Event not found' });
        return res.send({ message: 'Event found:', event });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting Event' });
    }
}

exports.updateEvent = async (req, res) => {
    try {
        let eventId = req.params.id;
        let data = req.body;
        let updatedEvent = await Event.findOneAndUpdate(
            { _id: eventId },
            data,
            { new: true }
        )
        if (!updatedEvent) return res.send({ message: 'Event not found and not updated' });
        return res.send({ message: 'Event updated:', updatedEvent });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating Event' });
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        let eventid = req.params.id
        let deletedEvent = await Event.findOneAndDelete({ _id: eventid })
        if (deletedEvent) return res.send({ message: 'Event deleted sucessfully', deletedEvent })
        return res.status(404).send({ message: 'Event not found and not deleted' })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting event' })
    }
}