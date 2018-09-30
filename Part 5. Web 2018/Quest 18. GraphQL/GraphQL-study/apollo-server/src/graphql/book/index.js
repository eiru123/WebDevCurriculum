import { types, typeResolvers } from './_type';
import { queryTypes, queryResolvers } from './_query';
import inputTypes from './input';
import { mutationTypes, mutationResolvers } from './mutation';

export default {
    types: () => [types, queryTypes, inputTypes, mutationTypes],
    resolvers: Object.assign(queryResolvers, mutationResolvers, typeResolvers),
}