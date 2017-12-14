var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    imgsmall: {
        type: String,
    },

    company: [{
        companyObj: {
            type: Schema.Types.ObjectId,
            ref: 'Company'
        },
        voteCount: {
            type: Number,
            default: 0
        }
    }]

});

schema.plugin(deepPopulate, {
    populate: {
        'company.companyObj': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Awardcategory', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'company.companyObj', 'company.companyObj'));
var model = {
    excelLeadershipboard: function (data, callback) {
        console.log("inside api")
        Awardcategory.find({}).deepPopulate("company.companyObj").exec(function (err, data) {
            if (err || _.isEmpty(data)) {
                callback(err, [])
            } else {
                callback(null, data)
            }
        })
    },
    generateExcelLeadershipboard: function (match, callback) {
        async.concatSeries(match, function (mainData, callback) {
                console.log("maindata..5555555555555", mainData);
                var obj = {};
                obj["NAME"] = mainData.name;

var myVal1 = '';
                var foo1 = ''
                _.forEach(mainData.company, function (pro1) {
                    myVal1 = pro1.companyObj.name + ',' + myVal1;
                    foo1 = myVal1.substring(0, myVal1.length - 1);
                })
                obj["CATEGORY"] = foo1;


                var myVal = '';
                var foo = ''
                _.forEach(mainData.company, function (pro) {
                    myVal = pro.voteCount + ',' + myVal;
                    foo = myVal.substring(0, myVal.length - 1);
                })
                obj["VOTECOUNT"] = foo;






                callback(null, obj);
            },
            function (err, singleData) {
                callback(null, singleData);
            });

    },
};
module.exports = _.assign(module.exports, exports, model);