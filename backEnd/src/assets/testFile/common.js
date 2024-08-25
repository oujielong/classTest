// 获取答案并且回填

//获取正确的答案，并展示
async function fetchAnswer() {
    try {
        let UserAnswer = await axios.get('http://localhost:3000/ajax/getUserAnswer');
        let answerdetail = UserAnswer.data.answers;
        Object.keys(answerdetail).forEach(key => {
            document.querySelector(`input[id=${ key }]`).value = answerdetail[ key ];
        });
    } catch (error) {
    }
}

document.addEventListener('DOMContentLoaded', function () {
    
    fetchAnswer();
});