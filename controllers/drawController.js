const drawModel = require('../models/drawModel');

exports.addDraw = async (req, res) => {
    try {
        const typeId = req.body.typeId;
        const placeId = req.body.placeId;
        const numbers = req.body.numbers;
        const date = new Date(req.body.date);

        if (!typeId || !placeId || !numbers || !date) {
            res.status(400).json({ title: 'Error!', message: 'All fiends are required!' });
        } else {
            const formattedDate = date.toISOString().split('T')[0];
            drawModel.draw.find({ date: formattedDate, typeId: typeId, placeId: placeId }).then(async (response) => {
                if (response.length > 0) {
                    res.status(400).json({ title: 'Error!', message: 'This draw is already added!' });
                } else {
                    const newDraw = new drawModel.draw({
                        date: formattedDate,
                        typeId: typeId,
                        placeId: placeId,
                        numbers: numbers
                    });

                    newDraw.id = newDraw._id.toString();

                    await newDraw.save();
                    res.status(200).json({ title: 'Success', message: 'Draw added successfully' });
                }
            });
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: error.message });
    }
};

exports.getDraws = async (req, res) => {
    try {
        const byDate = new Date(req.params.byDate);
        const byType = req.query.byType;

        if (byDate instanceof Date && !isNaN(byDate)) {
            const byDateString = byDate.toISOString().split('T')[0];

            let draws = [];

            if (!byType) {
                draws = await drawModel.draw.aggregate([
                    {
                        $match: {
                            date: byDateString
                        }
                    },
                    {
                        $lookup: {
                            from: "drawtypes",
                            localField: "typeId",
                            foreignField: "id",
                            as: "drawtype"
                        }
                    },
                    {
                        $unwind: "$drawtype"
                    },
                    {
                        $lookup: {
                            from: "places",
                            localField: "placeId",
                            foreignField: "id",
                            as: "place"
                        }
                    },
                    {
                        $unwind: "$place"
                    },
                    {
                        $project: {
                            _id: 1,
                            date: 1,
                            numbers: 1,
                            "drawtype.name": 1,
                            "place.name": 1,
                        }
                    }
                ]);
            } else {
                draws = await drawModel.draw.aggregate([
                    {
                        $match: {
                            date: byDateString,
                            typeId: byType
                        }
                    },
                    {
                        $lookup: {
                            from: "drawtypes",
                            localField: "typeId",
                            foreignField: "id",
                            as: "drawtype"
                        }
                    },
                    {
                        $unwind: "$drawtype"
                    },
                    {
                        $lookup: {
                            from: "places",
                            localField: "placeId",
                            foreignField: "id",
                            as: "place"
                        }
                    },
                    {
                        $unwind: "$place"
                    },
                    {
                        $project: {
                            _id: 1,
                            date: 1,
                            numbers: 1,
                            "drawtype.name": 1,
                            "place.name": 1,
                        }
                    }
                ]);
            }

            let drawsObj = [];

            draws.forEach(draw => {
                drawsObj.push({
                    ID: draw._id,
                    Date: draw.date,
                    Numbers: draw.numbers,
                    Place: draw.place.name,
                    Draw_Type: draw.drawtype.name
                });
            });

            res.status(200).json(drawsObj);
        } else {
            res.status(400).json({ title: 'Error!', message: 'Invalid date format!' });
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again.' });
    }
};