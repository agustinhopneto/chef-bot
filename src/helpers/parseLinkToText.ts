const parseLinkToText = (text?: string) => {
  return text ? text.replace(/<a.*">/, '').replace('</a>', '') : null;
};

export default parseLinkToText;
