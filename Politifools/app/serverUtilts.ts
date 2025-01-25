import { serverDb } from "./serverDB";
import type {
  GovernmentLevelPageData,
  GovernmentPositionPageData,
  PoliticianPageData,
  PublicProfilePageData,
} from "./types";

export async function GetPoliticianPageData(
  govLevel: string,
  govPosition: string,
  individual: string,
  userID: string | null
) {
  // gets all data for politician page
  try {
    const data = await serverDb.query<PoliticianPageData>(
      `
         SELECT 
            politicians.id,
            politicians.name,
            politicians.url_path,
            politicians.description,
            government_positions.title AS position_title,
            government_positions.url_path AS gov_position_url_path,
            government_levels.url_path AS gov_level_url_path,
            states.name AS state_name,
            political_parties.name AS party_name,
            (
                SELECT 
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'text', comments.text,
                            'id', comments.id,
                            'fk_user_id', comments.fk_user_id,
                            'raw_user_meta_data', JSONB_BUILD_OBJECT(
                                'first_name', auth_users.raw_user_meta_data->>'first_name',
                                'last_name', auth_users.raw_user_meta_data->>'last_name',
                                'fk_party_affiliation', (auth_users.raw_user_meta_data->>'fk_party_affiliation')::INTEGER,
                                'private_profile', (auth_users.raw_user_meta_data->>'private_profile')::BOOLEAN,
                                'public_profile_url', auth_users.raw_user_meta_data->>'public_profile_url'
                            ),
                            'created_at', comments.created_at
                        )
                    ) 
                FROM 
                    comments
                JOIN 
                    auth.users AS auth_users 
                    ON comments.fk_user_id = auth_users.id
                WHERE 
                    comments.fk_politician_id = politicians.id
            ) AS all_comments,
            (
                SELECT 
                    JSON_BUILD_OBJECT(
                        'total_likes', 
                        COUNT(CASE WHEN likes.is_like = true THEN 1 ELSE NULL END),
                        'total_dislikes', 
                        COUNT(CASE WHEN likes.is_like = false THEN 1 ELSE NULL END)
                    )
                FROM 
                    likes
                WHERE 
                    likes.fk_politician_id = politicians.id
            ) AS likes,
           (
    SELECT 
        JSON_BUILD_OBJECT(
            'id', likes.id,
            'has_liked', 
                CASE
                    WHEN likes.is_like IS TRUE THEN TRUE
                    WHEN likes.is_like IS FALSE THEN FALSE
                    ELSE NULL
                END
        )
    FROM 
        likes
    WHERE 
        likes.fk_politician_id = politicians.id
        AND likes.fk_user_id = $4
    LIMIT 1
) AS user_has_liked

        FROM 
            politicians
        JOIN 
            government_positions 
            ON politicians.fk_government_positions_id = government_positions.id 
        JOIN 
            government_levels 
            ON politicians.fk_government_levels_id = government_levels.id
        LEFT JOIN 
            states 
            ON politicians.fk_state_id = states.id
        LEFT JOIN 
            political_parties 
            ON politicians.fk_party_affiliation = political_parties.id
        WHERE 
            politicians.url_path = $1
            AND government_positions.url_path = $2 
            AND government_levels.url_path = $3;
      `,
      [individual, govPosition, govLevel, userID]
    );

    if (data.rows[0] === undefined) {
      return "404";
    }

    return data.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function GetBrowsePageData() {
  try {
    const data = await serverDb.query(`
       SELECT 
        politicians.*,
        government_levels.name AS government_level_name,
        government_levels.url_path AS government_level_path,
        political_parties.name AS party_name,
        government_positions.title as position_name,
        government_positions.url_path as government_position_path
      FROM 
          politicians

      LEFT JOIN government_levels 
      ON politicians.fk_government_levels_id = government_levels.id

      LEFT JOIN political_parties
      ON politicians.fk_party_affiliation = political_parties.id

      LEFT JOIN government_positions
      ON politicians.fk_government_positions_id = government_positions.id;
    `);

    return data.rows;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function GetPublicProfilePageData(
  publicProfileUrl: string | undefined
) {
  if (publicProfileUrl === undefined) return null;
  try {
    const user = await serverDb.query<PublicProfilePageData>(
      `
      SELECT 
    auth_users.raw_user_meta_data,
    auth_users.created_at,
    (
    SELECT 
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'text', comments.text,
                'id', comments.id,
                'fk_user_id', comments.fk_user_id,
                'created_at', comments.created_at,
                'politician', JSON_BUILD_OBJECT(
                    'id', politicians.id,
                    'name', politicians.name,
                    'url_path', politicians.url_path,
                    'position', JSON_BUILD_OBJECT(
                        'title', government_positions.title,
                        'url_path', government_positions.url_path
                    ),
                    'level', JSON_BUILD_OBJECT(
                        'name', government_levels.name,
                        'url_path', government_levels.url_path
                    )
                )
            )
        )
    FROM comments
    LEFT JOIN politicians
    ON comments.fk_politician_id = politicians.id
    LEFT JOIN government_positions
    ON politicians.fk_government_positions_id = government_positions.id
    LEFT JOIN government_levels
    ON politicians.fk_government_levels_id = government_levels.id
    WHERE comments.fk_user_id = auth_users.id
) AS user_comments,
    (
        SELECT 
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'is_like', likes.is_like,
                    'created_at', likes.created_at,
                    'fk_user_id', likes.fk_user_id,
                    'fk_politician_id', likes.fk_politician_id,
                    'politician', JSON_BUILD_OBJECT(
                     'url_path', politicians.url_path,
                    'id', politicians.id,
                    'name', politicians.name,
                    'position', JSON_BUILD_OBJECT(
                      'title', government_positions.title,
                      'url_path', government_positions.url_path
                    ),
                    'level', JSON_BUILD_OBJECT(
                      'name', government_levels.name,
                      'url_path', government_levels.url_path
                    )
                    )
                )
            )
        FROM likes
        LEFT JOIN politicians
        ON likes.fk_politician_id = politicians.id
        LEFT JOIN government_positions
        ON politicians.fk_government_positions_id = government_positions.id
        LEFT JOIN government_levels
        ON politicians.fk_government_levels_id = government_levels.id
        WHERE likes.fk_user_id = auth_users.id
    ) AS user_likes
FROM 
    auth.users AS auth_users
WHERE 
    auth_users.raw_user_meta_data->>'public_profile_url' = $1
    AND auth_users.raw_user_meta_data->>'private_profile' = $2;
      `,
      [publicProfileUrl, false]
    );

    if (user.rowCount === 0) {
      return "user_doesnt_exist";
    }

    return user.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function GetGovPositionIndividuals(govPosition: string) {
  try {
    const individuals = await serverDb.query<GovernmentPositionPageData>(
      `
      SELECT 
  gp.*, 
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', p.id,
      'name', p.name,
      'url_path', p.url_path
    )
  ) AS politicians,
  gl.id, gl.url_path AS gov_level_path
FROM 
  government_positions AS gp
LEFT JOIN 
  politicians AS p 
  ON gp.id = p.fk_government_positions_id
LEFT JOIN 
  government_levels AS gl
  ON gp.fk_government_level_id = gl.id
WHERE 
  gp.url_path = $1
GROUP BY 
  gp.id, gl.id;

      `,
      [govPosition]
    );

    return individuals.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function GetGovLevelIndividuals(govLevel: string) {
  try {
    const individuals = await serverDb.query<GovernmentLevelPageData>(
      `
     SELECT 
        gl.id AS gov_level_id,
        gl.name AS gov_level_name,
        gl.url_path AS gov_level_path,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', p.id,
            'name', p.name,
            'url_path', p.url_path,
            'position', JSON_BUILD_OBJECT(
              'id', gp.id,
              'title', gp.title,
              'url_path', gp.url_path
            )
          )
        ) AS politicians
      FROM 
        government_levels AS gl
      LEFT JOIN 
        government_positions AS gp 
        ON gp.fk_government_level_id = gl.id
      LEFT JOIN 
        politicians AS p 
        ON gp.id = p.fk_government_positions_id
      WHERE 
        gl.url_path = $1
      GROUP BY 
        gl.id, gl.name, gl.url_path;
      `,
      [govLevel]
    );

    return individuals.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}
