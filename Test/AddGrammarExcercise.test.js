const request = require('supertest');
// Hoặc, nếu API của bạn chạy trên một server riêng biệt:
const app = 'http://localhost:3500'; // Thay thế bằng URL của API
const url = '/admin/grammar-exercise/add';
const MongoDBTestHelper = require('./MongoDBTestHelper');
let dbHelper = new MongoDBTestHelper();

describe('Thêm một bài tập', () => {

    beforeAll(async () => {
        await dbHelper.connect();
    });

    afterEach(async () => {
        // Tìm tất cả các tài liệu với title là 'Quest_1' trong collection 'grammarexercises'
        const foundGrammars = await dbHelper.findDocumentsByTitle('grammarexercises', 'Quest_1');
    
        // Xóa tất cả tài liệu có title là 'Quest_1'
        if (foundGrammars.length > 0) {
            for (let grammar of foundGrammars) {
                await dbHelper.deleteOne('grammarexercises', { _id: grammar._id });
            }
        }
    });

    afterAll(async () => {
        // Đảm bảo đóng kết nối MongoDB
        await dbHelper.close();
    });

    it('TC1: title khi để trống', async () => {
        const res = await request(app)
            .post(url)
            .send({ title: '', questions: ['Q1', 'Q2'] });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Title cannot be empty.');
    });

    it('TC2: mảng Question là null', async () => {
        const res = await request(app)
            .post(url)
            .send({ title: 'Quest_1'});

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Questions are invalid.');
    });

    it('TC3: thêm dữ liệu mới thành công', async () => {
        // Gửi yêu cầu POST để thêm dữ liệu mới
        const res = await request(app)
            .post(url)
            .send({ title: 'Quest_1', questions: ['Q1', 'Q2'] });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Grammar exercise added successfully!');
    });    
    
    it('TC4: lỗi khi thêm dữ liệu đã tồn tại', async () => {
        await request(app)
            .post(url)
            .send({ title: 'Quest_1', questions: ['Q1', 'Q2'] });

        const res = await request(app)
            .post(url)
            .send({ title: 'Quest_1', questions: ['Q1', 'Q2'] });

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Error adding grammar exercise');
    });

});