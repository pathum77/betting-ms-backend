const drawModel = require('../models/drawModel');

exports.getResults = async (req, res) => {
    try {
        const byDate = req.params.byDate;

        const bets = await drawModel.draw.aggregate([
            {
                $match: {
                    date: byDate
                }
            },
            {
                $lookup: {
                    from: "bets",
                    localField: "numbers",
                    foreignField: "numbers",
                    as: "bet"
                }
            },
            {
                $unwind: "$bet"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "bet.userId",
                    foreignField: "id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
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
                    "place.name": 1,
                    "drawtype.name": 1,
                    "user.username": 1,
                    "user.firstName": 1,
                    "user.lastName": 1,
                    "bet.userId": 1,
                }
            }
        ]);

        const betsObj = [];

        bets.forEach(bet => {
            betsObj.push({
                Bet_ID: bet._id,
                Date: bet.date,
                Numbers: bet.numbers,
                Place: bet.place.name,
                Draw_Type: bet.drawtype.name,
                Username: bet.user.username,
                User: bet.user.firstName + ' ' + bet.user.lastName
            });
        });

        res.status(200).json(betsObj);
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Plaese try again.' });
    }
};