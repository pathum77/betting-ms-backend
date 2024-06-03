const betsModel = require('../models/betsModel');
const userModel = require('../models/userModel');
const drawModel = require('../models/drawModel');

exports.addBet = async (req, res) => {
    try {
        const userId = req.user.userId;
        const drawTypeId = req.body.drawTypeId;
        const drawDate = req.body.drawDate;
        const betData = req.body.betData;
        const date = new Date().toISOString().split('T')[0];


        if (!drawTypeId || betData.length === 0) {
            res.status(400).json({ title: 'Error!', message: 'All fiends are required!' });
        } else {
            const userBet = await betsModel.bet.find({ userId: userId, date: date, drawTypeId: drawTypeId });

            if (userBet.length > 0) {
                res.status(400).json({ title: 'Error!', message: 'You have already bet to this draw.' });
            } else {
                const bet = new betsModel.bet({
                    date: date,
                    drawDate: drawDate,
                    userId: userId,
                    drawTypeId: drawTypeId,
                    betData: betData,
                });

                bet.save().then(() => {
                    res.status(201).json({ title: 'bet added', message: 'Bet added successfully' });
                })
            }
        }
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again' });
    }
};

exports.getBets = async (req, res) => {
    try {
        const byDate = req.params.byDate;

        const bets = await betsModel.bet.aggregate([
            {
                $match: {
                    date: byDate
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "drawtypes",
                    localField: "drawTypeId",
                    foreignField: "id",
                    as: "draw"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $unwind: "$draw",
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    drawDate: 1,
                    betData: 1,
                    "user.id": 1,
                    "user.firstName": 1,
                    "user.lastName": 1,
                    "draw.name": 1,
                }
            }
        ]);

        const betsObj = [];

        bets.forEach(bet => {
            betsObj.push({
                betId: bet._id,
                userId: bet.user.id,
                userName: `${bet.user.firstName} ${bet.user.lastName}`,
                drawName: bet.draw.name,
                bettedDate: bet.date,
                drawedDate: bet.drawDate,
                bets: bet.betData
            });
        });

        res.status(200).json(betsObj);

    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again' });
    }
};