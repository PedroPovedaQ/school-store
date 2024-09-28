import {fetchAPI} from "@/utils/fetch-api";

export async function getPageBySlug(slug: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const path = `/pages`;
    const urlParamsObject = {filters: {slug}, locale: lang,
    populate: {
        '__component': '*', 
        video: { fields: ['url'] },
        cover: { fields: ['url'] },
        'large-video': '*',
        'sections.large-video': '*',
        authorsBio: { populate: '*' },
        category: { fields: ['name'] },
        sections: { 
            populate: {
                '__component': '*', 
                'files': '*',
                'file': '*',
                'url': '*',
                'body': '*',
                'title': '*',
                'large-video': '*',
            }
        },
    },

};
    const options = {headers: {Authorization: `Bearer ${token}`}};
    return await fetchAPI(path, urlParamsObject, options);
}