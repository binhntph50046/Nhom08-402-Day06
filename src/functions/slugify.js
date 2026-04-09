export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Chuẩn hóa Unicode
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '') // Loại bỏ ký tự đặc biệt
        .replace(/(\s+)/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-') // Loại bỏ nhiều dấu gạch ngang liên tiếp
        .replace(/^-+|-+$/g, ''); // Loại bỏ dấu gạch ngang ở đầu và cuối
};
