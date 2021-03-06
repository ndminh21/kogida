"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const fs = require("fs");
const stringSimilarity = require("string-similarity");
const KhongDau = require("khong-dau");
const ExcelService_1 = require("../../service/other/ExcelService");
const SubdivisionService_1 = require("../../service/database/SubdivisionService");
class SubdivisionController {
    static route(router) {
        var subdivision = new SubdivisionService_1.default();
        var excel = new ExcelService_1.default();
        var authentication = new authentication_1.Authentication();
        router.get("/dvhc-viet-nam", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var subdivisions = await subdivision.findAll();
            res.render("../module/subdivision/view", {
                userInfo: req.user,
                subdivisions: subdivisions,
                message: req.flash("fm-subdivision-addmanual")
            });
        });
        router.post("/cap-nhat-dvhc-thu-cong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var subReq = req.body.subdivision;
            var sub = await subdivision.getByComId(subReq.ComId);
            if (sub)
                req.flash("fm-subdivision-addmanual", "Mã đơn vị cấp xã đã tồn tại trong hệ thống");
            else
                await subdivision.addSubdivision(subReq);
            res.redirect('/dvhc-viet-nam');
        });
        router.post("/cap-nhat-dvhc-bang-file", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            try {
                await subdivision.deleteAll();
                var filePath = req.files[0].path;
                var jsonArrayData = await excel.convertToJSonWithHeader(filePath);
                for (var index = 0; index < jsonArrayData.length; index++) {
                    await subdivision.addSubdivision(jsonArrayData[index]);
                }
                fs.unlinkSync(filePath);
                res.redirect("/dvhc-viet-nam");
            }
            catch (e) {
                res.send(e);
            }
        });
        router.get("/lay-dvhc-de-hien-thi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var subdivisions = await subdivision.findAll();
            var result = [];
            for (var index = 0; index < subdivisions.length; index++) {
                var sub = subdivisions[index].toJSON();
                let text = (sub.ComName != '' && sub.ComName != null) ? (sub.ComName + " - " + sub.DistName + " - " + sub.ProvName) : (sub.DistName + " - " + sub.ProvName);
                let element = {
                    id: sub.ComId,
                    text: text
                };
                result.push(element);
            }
            res.json(result);
        });
        router.get("/tim-dvhc-theo-ten", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var textSearch = KhongDau(req.query.text).toLowerCase();
            var similarity = stringSimilarity.compareTwoStrings('Binh Hung Hoa', 'Binh Hung Hoa');
            var subdivisions = await subdivision.findAll();
            var result = [];
            for (var index = 0; index < subdivisions.length; index++) {
                var sub = subdivisions[index].toJSON();
                let text = (sub.ComName != '' && sub.ComName != null) ? (sub.ComName + " - " + sub.DistName + " - " + sub.ProvName) : (sub.DistName + " - " + sub.ProvName);
                let similarity = stringSimilarity.compareTwoStrings(textSearch, KhongDau(text).toLowerCase());
                let element = {
                    id: sub.ComId,
                    text: text,
                    match: similarity
                };
                result.push(element);
            }
            result.sort(function (a, b) {
                var keyA = a.match, keyB = b.match;
                // Compare the 2 dates
                if (keyA < keyB)
                    return 1;
                if (keyA > keyB)
                    return -1;
                return 0;
            });
            result = result.filter(x => x.match != 0);
            for (var index = 0; index < result.length; index++) {
                delete result[index].match;
            }
            res.json(result);
        });
    }
}
exports.default = SubdivisionController;
