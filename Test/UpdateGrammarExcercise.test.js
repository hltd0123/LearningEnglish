const request = require('supertest');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const app = 'http://localhost:3500';
const url = '/admin/grammar-exercise/update/'; 
const MongoDBTestHelper = require('./MongoDBTestHelper');
const e = require('connect-flash');
const exp = require('constants');
let dbHelper = new MongoDBTestHelper();

describe('Grammar update API', () => {
    let grammarExerciseTest = {
        _id: new ObjectId(), 
        title: "TestData",    
        questions: ["Q1", "Q2"]
    };    
    let idTest;

    beforeAll(async () => {
        await dbHelper.connect();
    });

    beforeEach(async () => {
        data = await dbHelper.insertOne('grammarexercises', grammarExerciseTest);
        idTest = data.insertedId.toString();
    });

    afterEach(async () => {
        try {
            await dbHelper.deleteOne('grammarexercises', { _id: new ObjectId(idTest) });
        }
        catch(e){

        }
    });

    afterAll(async () => {
        // Đảm bảo đóng kết nối MongoDB
        await dbHelper.close();
    });

    it('TC1: title khi để trống', async () => {
        const res = await request(app)
            .post(url + idTest)
            .send({
                title: '',  // Title trống
                questions: ["Q1", "Q2"],
            });
        
        // Kiểm tra mã phản hồi và thông báo lỗi
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Title cannot be empty.');
    });    

    it('TC2: mảng Question là null', async () => {
        const res = await request(app)
            .post(url + idTest)
            .send({
                title: 'Quest_1',  // Title hợp lệ
            });
    
        // Kiểm tra mã phản hồi và thông báo lỗi
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Questions are invalid.');
    });    
    
    it('TC3: lỗi khi thêm dữ liệu', async () => {
        const res = await request(app)
            .post(url + idTest)
            .send({
                title: 'Quest_1', 
                questions: ['Q1', 'Q2'] 
            });
    
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Error adding grammar exercise');
    });    

    it('TC4: thêm dữ liệu mới thành công', async () => {
        const res = await request(app)
            .post(url + idTest)
            .send({
                title: 'Quest_2',
                questions:  ["Q1", "Q2"]
            });
    
        // Kiểm tra thông báo thành công
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Grammar exercise added successfully!');
    });    

    it('TC5: object không tồn tại', async () => {
        // Xóa đối tượng để đảm bảo nó không còn tồn tại trong DB
        await dbHelper.deleteOne('grammars', { _id: new ObjectId(idTest) });
    
        const res = await request(app)
            .post(url + idTest)
            .send({
                title: 'Quest_1',  // Tiêu đề hợp lệ
                questions: ['Q1', 'Q2']  // Gửi câu hỏi dưới dạng mảng hợp lệ
            });
    
        // Kiểm tra mã phản hồi và thông báo lỗi
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Grammar exercise not found.');
    });    
    
});
