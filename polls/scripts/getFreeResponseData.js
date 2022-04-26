//gather all the free response data needed to be displayed to user

module.exports = async (p) => {
    
    delete p.responseAnswers;
    delete p.responseChoices;

    return {
        poll_data: p
    };
}