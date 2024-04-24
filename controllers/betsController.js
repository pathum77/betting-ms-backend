const betsModel = require('../models/betsModel');
const userModel = require('../models/userModel');
const drawModel = require('../models/drawModel');

exports.addBet = async (req, res) => {
    try {
        const userId = req.user.userId;
        const drawTypeId = req.body.drawTypeId;
        const betNumbers = req.body.betNumbers;
        const amount = req.body.amount;
        const drawDate = req.body.drawDate;
        const date = new Date().toISOString().split('T')[0];

        if (!drawTypeId || !betNumbers || !amount || !drawDate) {
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
                    amount: amount,
                    numbers: betNumbers,
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
                    numbers: 1,
                    amount: 1,
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
                Bet_ID: bet._id,
                User_Id: bet.user.id,
                User_Name: `${bet.user.firstName} ${bet.user.lastName}`,
                Draw_Name: bet.draw.name,
                Betted_Date: bet.date,
                Draw_date: bet.drawDate,
                Numbers: bet.numbers,
                Amount: bet.amount
            });
        });

        res.status(200).json(betsObj);

    } catch (error) {
        res.status(500).json({ title: 'Error!', message: 'Something went wrong. Please try again' });
    }
};