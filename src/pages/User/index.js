import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {

  state = {
    stars: [],
    loading: false,
  };

  async componentDidMount() {
    this.getUserData();
  }

  getUserData = async () => {
    const { stars } = this.state;
    const { route } = this.props;
    const { user } = route.params;

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
    })
  };

  render() {
    const { stars, loading } = this.state;
    const { route } = this.props;
    const { user } = route.params;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? <ActivityIndicator color="#000" /> : (
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={[{ uri: item.owner.avatar_url }]} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
        )}
      </Container>
    )
  }
}

User.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      login: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
      bio: PropTypes.string
    }),
  }).isRequired,
};
