var express = require('express');
const router = express.Router();
const { isLoggedIn, isUserSeller, isUserCharity } = require('./middlewares');

const Container = new (require('../utils/Container.js'));

router.post('/register', isUserSeller, async (req, res, next) => {
    let item = { name , price, content, stock, title_img } = req.body;
    try{
        const itemServiceInstance = Container.get('itemService');
        let result = await itemServiceInstance.register(req.user, item);
        console.log(result);
        //res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=None");
        return res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//Todo: add category filter 
router.get('/items', async (req,res,next) => {
    try{
        const itemServiceInstance = Container.get('itemService');
        const items = await itemServiceInstance.getItemList();
        res.json({
            data : items,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});
router.get('/myItems', isUserSeller, async (req,res,next) => {
    try{
        const itemServiceInstance = Container.get('itemService');
        const items = await itemServiceInstance.getMyItems(req.user);
        res.json({
            data : items,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/detail/:itemId', async (req, res, next) => {
    try{
        const itemServiceInstance = Container.get('itemService');
        const item = await itemServiceInstance.getItem(req.params.itemId);
        if(!item){
            return res.status(201).json({
                data : [],
                
                msg : "wrong id",
            });
        }
        return res.json({
            data : item,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/buy', isUserCharity, async (req, res, next) => {
    const { addr, itemId, orderCount, campaignId } = req.body;
    try{
        const tradeInstance = Container.get('tradeService');
        const result = await tradeInstance.buyItem(req.user, addr, itemId, parseInt(orderCount), campaignId);
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;