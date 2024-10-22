##### Prerequisite #####
FROM playcourt/nodejs:20-alpine AS deps
WORKDIR /usr/src/app
COPY package.json ./
USER root
RUN chown -R user /usr/src/app
USER user
RUN npm install -f

##### Builder #####
FROM playcourt/nodejs:20-alpine AS builder
ARG DIST_ENVIRONMENT
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
#COPY .env.dist.${DIST_ENVIRONMENT} .env
COPY . .
USER root
RUN npm run build
RUN chown -R user /usr/src/app
# optimize runner's node modules disk usage by removing all dev dependencies
USER user
RUN npm prune --omit=dev --legacy-peer-deps

##### Runner #####
FROM playcourt/nodejs:20-alpine AS runner
WORKDIR /usr/src/app
ENV DD_VERSION=${SCM_COMMIT_ID}
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/dist ./dist/
COPY --from=builder /usr/src/app/node_modules ./node_modules/
EXPOSE 9000
USER user
CMD ["node", "dist/main"]
